//TO-DO: Validate error and add custom error in every function
export const errorHandlerMiddleware = (err: any, req: any, res: any) => {
   if (err) {
      res.status(200).send({ status: 500, message: err })
      return res.end()
   }
}
