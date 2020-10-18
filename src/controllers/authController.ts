import {ExegesisContext , Callback} from 'exegesis';
import {TOKE_SECRET, REFRESH_TOKEN_SECRET, SALT_HASH_KEY,TOKEN_EXPIRATION_TIME} from '../../configs/auth';
import * as jwt from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

const mongoose = require('mongoose');

export function singUp(context: ExegesisContext, callback : Callback<any>)  {
  if (!context.req.body.password || !context.req.body.email){
    callback({name: "signUp" , message: "Invalid params" },null);
  }
  var parseData = {
    name : context.req.body.name,
    surname : context.req.body.surname,
    email : context.req.body.email,
    password : context.req.body.password
  };

  bcrypt.hash(parseData['password'], SALT_HASH_KEY, function(err, hash) {
    if (err)
    callback({name: "bcrypt" , message: err },null);
    parseData['password'] = hash;
      mongoose.model('User').create(parseData , (err,data) => {callback(err,data)});
  });
}

export async function login(context: ExegesisContext) {
  const { email, password } = context.req.body;

  if ( context.req.body['TokenExpiredError']){
    return context.res.status(400).set('content-type', 'application/json').setBody({message: `Prevent from multiples request`, refreshed: true});
  }

  if (!email || !password){
    return context.res.status(400).set('content-type', 'application/json').setBody({message: `Email and password required`});
  }

  let user = await  mongoose.model('User').findOne({ email: context.req.body.email});
  if (!user) {
    return context.res.status(400).set('content-type', 'application/json').setBody({message: `Email not found`});
  }

  if (user.emailStatus !== 'confirmed'){
    return context.res.status(403).set('content-type', 'application/json').setBody({message: `Not activated`});
  }

  if (!bcrypt.compareSync(password, user.password)){
    return context.res.status(401).set('content-type', 'application/json').setBody({message: `Invalid password`});
  }

  const response = generateTokenResponse(user);
  return context.res.status(200).set('content-type', 'application/json').setBody(response);
}


/**
 * For future implementation of Refresht token.
 */
export function refreshToken (context: ExegesisContext, callback) {
  const { refreshToken, email } = context.req.body;

  if (!refreshToken || !email) {
    callback({type: 'missing', status: 403, message: 'Access denied,refresh token missing'},null);
  }

  mongoose.model.User.findOne({email,refreshToken} ,(err, user) =>{
    if (err || !user) {
      callback({type: 'missing', status: 401, message: 'Access denied, refresh token not found'},null);
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, function(err, decoded) {
      if (err)
        callback({type: 'missing', status: 401, message: err},null);

        const response = generateTokenResponse(user);
        callback(null,response);
    });
  });
}

export function jwtAuthenticator(pluginContext, info, callback) {
  if (!pluginContext.req.headers['authorization']) {
    callback({type: 'missing', status: 403, message: 'Authorization header not included'},null);
  }
  const TOKEN = pluginContext.req.headers['authorization'].split(" ").pop();

  try {
    var decoded = jwt.verify(TOKEN, TOKE_SECRET);
    callback(null,{type: 'success', user : {roles:[], scopes:[]}});
  } catch(err) {
    if (err.expiredAt){
      callback({type: 'invalid', status: 401, message: `TokenExpiredError ${err.expiredAt}`},null);
    }
    callback({type: 'invalid', status: 401, message: 'Invalid session key'},null);
  }
}

function generateTokenResponse(user) {
  const TOKEN_PAYLOAD = {
    email: user.email,
    rol: user.rol,
    scopes: user.scopes
  };
  const TOKEN = jwt.sign(TOKEN_PAYLOAD, TOKE_SECRET, {expiresIn: TOKEN_EXPIRATION_TIME });
  // const REFRESH_TOKEN = jwt.sign('', TOKE_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRATION_TIME }); TODO
  //return  {token: TOKEN , refresh_token: REFRESH_TOKEN};
  return  {token: TOKEN };
}

