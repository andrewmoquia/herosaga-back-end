//TO-DO: Validate error and add custom error in every function
export const errorHandlerMiddleware = (err: any, req: any, res: any) => {
   if (err) {
      res.status(200).send({ status: 500, message: 'Something went wrong, try again later.' })
      return res.end()
   }
}
