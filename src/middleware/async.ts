//Wrap function to catch error
export const asyncWrapper = (fn: Function) => {
   return async (req: any, res: any, next: any) => {
      try {
         await fn(req, res, next)
      } catch (err) {
         next(err)
      }
   }
}
