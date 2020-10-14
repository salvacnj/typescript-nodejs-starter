# OPENAPI Typescript

A sample setup of a Typescript based API which uses Exegesis to work with the OpenAPI spec v3.


# Usage



[VS CODE CONFIG](https://code.visualstudio.com/docs/typescript/typescript-compiling#_hiding-derived-javascript-files)


# Models instrutions

The default way to set a model is in the openapi file, by using the openapi-mongoose packet.

For deeplier customization the model can also define on 'src/models' folder, but the won't appear on swagger documentation.

# Utils

### Generate SSL Cert.

Run the following command on the '/configs' directory.

``````
 openssl req -nodes -new -x509 -keyout server.key -out server.cert
 ``````

# Moongose operations

Find by name and Id:

```
let greet = await Greet.findOne({ _id: "5f4e9e5ff979cd5b24e0455a", name: 'holahola' });

```


# REFERENCES

[Exegesis Repo](https://github.com/exegesis-js/exegesis) for other examples.


# DUDAS
- ¿Respuesta en el body vacia?

# TAREAS
- Mejorar JWT expiry time [enlace](https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/)
- Versiones
- Enviroments
- Añadir dotenv example
