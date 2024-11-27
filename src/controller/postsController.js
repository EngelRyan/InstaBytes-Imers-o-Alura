import fs from "fs"
import {getAllPosts, cratePost, attPost} from "../models/postsModels.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listPosts(req,res) {

    const posts = await getAllPosts();

    res.status(200).json(posts); 
}

export async function postNewPost(req,res) {

    const newPost = req.body;

    try{

        const createdPost = await cratePost(newPost);

        res.status(200).json(createdPost);

    }catch(erro){

        console.error(erro.message);

        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function uploadImage(req,res) {

    const newPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    }
    try{

        const createdPost = await cratePost(newPost);

        const imageAtt = `uploads/${createdPost.insertedId}.png`;

        fs.renameSync(req.file.path, imageAtt)

        res.status(200).json(createdPost);

    }catch(erro){

        console.error(erro.message);

        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function attNewPost(req,res) {

    const id = req.params.id;

    const urlImage = `http://localhost:3000/${id}.png`

    try{

        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)

        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImage,
            descricao: descricao,
            alt: req.body.alt
        }

        const createdPost = await attPost(id, post);

        res.status(200).json(createdPost);

    }catch(erro){

        console.log(erro.message);

        res.status(500).json({"Erro": "Falha na requisição"});
    }
}