import {ExegesisContext} from 'exegesis';
import {TOKE_SECRET} from '../../configs/config';
const jwt = require('jsonwebtoken');


const mongoose = require('mongoose');


export async function login(context: ExegesisContext) {
  var User = mongoose.model('User');

  var user = await User.find({
    email: context.req.body.email,
    password: context.req.body.password
  });

  if (!user.length) {
    return context.res.setBody({code: 401, message: "Invalid credentials"});
  }

  const payload = {
    user,
    random: Math.random()
  };

  const token = jwt.sign(payload, TOKE_SECRET, {
    expiresIn: 1440
  });

  return context.res.setStatus(200).setBody({
    mensaje: 'Autenticación correcta',
    token: token
  });
}

export async function logout(context: ExegesisContext) {

}

