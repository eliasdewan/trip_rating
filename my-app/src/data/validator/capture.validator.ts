import { z } from "zod";
import { failedRequest } from "../uberTaskerScreenInfo/uberDataSample";

//use paramer in function later
const searchString = "away"; // Present in uber request as how far awai is the pickup

const arrayItemSchema = z.array(z.object({
  text: z.string()
}));

const containsAway = arrayItemSchema.refine(
  item => item.some(item => item.text.includes(searchString)),
  {
    message: `${searchString} not found.`,
    path: ['uber']
  }
); // this is the way for arrays

export const awayResult = () => containsAway.safeParse(failedRequest)
const testResult = awayResult();

if (!testResult.success) {
  console.log(testResult.error);
} else {
  console.log(testResult.data);
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