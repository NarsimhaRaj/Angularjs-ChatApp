const jwt=require('jsonwebtoken');

module.exports=function(req, res, next){
    const token = req.header('autherization');
    if (!token) res.sendStatus(403);
    try {
        const verified = jwt.verify(token,"sdfdsfd");
        req.user=verified;
        next();
    }catch(err){ res.sendStatus(403);}
}
