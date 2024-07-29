import { z } from "zod";
import { failedRequest } from "../uberTaskerScreenInfo/uberDataSample";

//use paramer in function later
// const searchString = "away"; // Present in uber request as how far awai is the pickup

const arrayItemSchema = z.array(z.object({
  text: z.string()
}));

const containsIncludesSchema = (searchString: string) => {
  return arrayItemSchema.refine(
    array => array.some(item => item.text.includes(searchString)),
    {
      message: `${searchString} not found.`,
      path: ['uber']
    }
  )
};

export const searchResult = (searchString: string, failedRequest: { [key: string]: string }[]) => {
  const schema = containsIncludesSchema(searchString);
  return schema.safeParse(failedRequest)
}


/** A json schema if ever required
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[]; 
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);
jsonSchema.parse(data);
 */