import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { printSchema } from 'graphql';

const schema = builder.toSchema({});

writeFileSync(resolve(__dirname, '../../schema.graphql'), printSchema(schema));

export default schema;