{
  "User": {
    "fullName": {
      "type": "String",
      "unique": true,
      "maxlength": 120
    },
    "email": {
      "type": "String",
      "unique": true,
      "maxlength": 200
    },
    "password": {
      "type": "String"
    },
    "passwordResetToken": {
      "type": "Number"
    },
    "lastSeenAt": {
      "type": "Number"
    },
    "emailStatus": {
      "type": "String",
      "enum": ["unconfirmed", "change-requested", "confirmed"]
    }
  },
  "Variable": {
    "symbol": {
      "type": "String"
    },
    "names": {
      "language": {
        "type": "String"
      },
      "name": {
        "type": "String"
      }
    }
  },
  "Measure": {
    "user": {
      "type": "String"
    },
    "sensor": {
      "type": "String"
    },
    "day": {
      "type": "Date"
    },
    "variable": {
      "type": "ObjectId"
    },
    "samples": [{}]
  },
  "ErrorModel": {
    "message": {
      "type": "String"
    },
    "code": {
      "type": "Number"
    }
  }
}
