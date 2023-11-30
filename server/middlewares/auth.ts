import * as dotenv from "dotenv";
import * as path from "path";
const envFilePath = path.join(__dirname, "../.env");
dotenv.config({ path: envFilePath });
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const secret = process.env.SECRET;

export function generateJwtAdmin(username: object) {
    if (secret !== undefined) {
        const token = jwt.sign(username, secret);
        return token;
    } else {
        console.error("Error generating the token");
        return;
    }
}

export function verifyJwtAdmin(req: Request, res: Response, next: NextFunction) {
    const token: string = req.cookies.adminToken;
    if (token) {
        if (secret !== undefined) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        res.sendStatus(401).json({
                            message: "Token has expired, please sign up again",
                        })
                        return;
                    }
                    res.sendStatus(401);
                    return;
                } else {
                    if (typeof decoded !== "string" && decoded !== undefined) {
                        console.log("Passed the authentication");
                        req.headers["username"] = decoded.username;
                        next();
                    } else {
                        res.sendStatus(401);
                    }
                }
            })
        } else {
            res.sendStatus(401);
        }

    } else {
        res.sendStatus(401);
    }
}

export function generateJwtUser(username: object) {
    if (secret !== undefined) {
        const token = jwt.sign(username, secret);
        return token;
    } else {
        console.error("Error generating the token");
        return;
    }
}

export function verifyJwtUser(req: Request, res: Response, next: NextFunction) {
    const token: string = req.cookies.userToken;
    if (token) {
        if (secret !== undefined) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.sendStatus(401);
                    return;
                } else {
                    if (typeof decoded !== "string" && decoded !== undefined) {
                        console.log("Passed the authentication")
                        req.headers["username"] = decoded.username;
                        next();
                    } else {
                        res.sendStatus(401);
                    }
                }
            })
        } else {
            res.sendStatus(401);
        }

    } else {
        res.sendStatus(401);
    }
}