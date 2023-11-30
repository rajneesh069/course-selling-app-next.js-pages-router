"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtUser = exports.generateJwtUser = exports.verifyJwtAdmin = exports.generateJwtAdmin = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const envFilePath = path.join(__dirname, "../.env");
dotenv.config({ path: envFilePath });
const jwt = __importStar(require("jsonwebtoken"));
const secret = process.env.SECRET;
function generateJwtAdmin(username) {
    if (secret !== undefined) {
        const token = jwt.sign(username, secret);
        return token;
    }
    else {
        console.error("Error generating the token");
        return;
    }
}
exports.generateJwtAdmin = generateJwtAdmin;
function verifyJwtAdmin(req, res, next) {
    const token = req.cookies.adminToken;
    if (token) {
        if (secret !== undefined) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        res.sendStatus(401).json({
                            message: "Token has expired, please sign up again",
                        });
                        return;
                    }
                    res.sendStatus(401);
                    return;
                }
                else {
                    if (typeof decoded !== "string" && decoded !== undefined) {
                        console.log("Passed the authentication");
                        req.headers["username"] = decoded.username;
                        next();
                    }
                    else {
                        res.sendStatus(401);
                    }
                }
            });
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
}
exports.verifyJwtAdmin = verifyJwtAdmin;
function generateJwtUser(username) {
    if (secret !== undefined) {
        const token = jwt.sign(username, secret);
        return token;
    }
    else {
        console.error("Error generating the token");
        return;
    }
}
exports.generateJwtUser = generateJwtUser;
function verifyJwtUser(req, res, next) {
    const token = req.cookies.userToken;
    if (token) {
        if (secret !== undefined) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.sendStatus(401);
                    return;
                }
                else {
                    if (typeof decoded !== "string" && decoded !== undefined) {
                        console.log("Passed the authentication");
                        req.headers["username"] = decoded.username;
                        next();
                    }
                    else {
                        res.sendStatus(401);
                    }
                }
            });
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
}
exports.verifyJwtUser = verifyJwtUser;
