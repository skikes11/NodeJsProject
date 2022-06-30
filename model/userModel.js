const { defaults } = require("joi");
const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true

    },
    name: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userrole',
        default: null
    },
    active: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date,
        //  default : "null"
    },
    phone: {
        type: String,
        //       default : "null"
    },
});


const AuthAccountSchema = new mongoose.Schema({

    facebook: {
        id: {
            type: String,
            required: true

        },
        email: {
            type: String,
            required: true

        },
        name: {
            type: String,
            require: true
        },
        avatar: {
            type: String
        },
        password: {
            type: String
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Userrole',
            default: null
        },
        active: {
            type: Boolean,
            default: false
        },
        dob: {
            type: Date,
            //  default : "null"
        },
        phone: {
            type: String,
            //       default : "null"
        }
    },
    google: {
        id: {
            type: String,
            required: true

        },
        email: {
            type: String,
            required: true

        },
        name: {
            type: String,
            require: true
        },
        avatar: {
            type: String
        },
        password: {
            type: String
        
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Userrole',
            default: null
        },
        active: {
            type: Boolean,
            default: false
        },
        dob: {
            type: Date,
            //  default : "null"
        },
        phone: {
            type: String,
            //       default : "null"
        }
    },
});



const userroleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})




let UserAccount = mongoose.model("UserAccount", userAccountSchema);
let Userrole = mongoose.model("Userrole", userroleSchema);
let AuthAccount = mongoose.model("AuthAccount", AuthAccountSchema);

module.exports = { UserAccount, Userrole, AuthAccount};