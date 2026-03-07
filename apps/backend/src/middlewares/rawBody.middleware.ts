import express from "express";

export const jsonMiddleware = express.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    },
});