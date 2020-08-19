import exprss from 'express'
export = {
  get: (req:exprss.Request, res: exprss.Response) => {
    res.send('hello world~');
  }
};
