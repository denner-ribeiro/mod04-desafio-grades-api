import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

// utiliza o schema criado
const { gradeModel } = db;

// FEITO
const create = async (req, res) => {
  const { name, subject, type, value } = req.body;

  const grade = new gradeModel({
    name,
    subject,
    type,
    value,
  });

  try {
    const data = await grade.save();

    res.json(data);
    // res.send({ message: 'Grade inserido com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify(data)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

// FEITO
const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const data = await gradeModel.find(condition);

    if (!data) {
      res.status(400).send('Nenhuma nota encontrada');
    } else {
      res.json(data);
    }

    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

// FEITO
const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await gradeModel.findById({ _id: id });

    if (!data) {
      res.status(404).send('Nenhuma nota encontrada com o id informado');
    } else {
      res.json(data);
    }

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

// FEITO
const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const data = await gradeModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!data) {
      res.status(404).send('Nenhuma nota encontrada com o id informado');
    } else {
      res.json(data);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

// FEITO
const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await gradeModel.findByIdAndRemove({ _id: id });

    if (!data) {
      res.status(404).send('Não encontrado nenhuma nota para excluir');
    } else {
      res.send('Nota excluida com sucesso');
    }

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

// FEITO
const removeAll = async (req, res) => {
  try {
    const data = await gradeModel.deleteMany();

    if (!data) {
      res.status(404).send('Não encontrado nenhuma nota para excluir');
    } else {
      res.send('Notas excluidas com sucesso');
    }

    logger.info(`DELETE ALL /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
