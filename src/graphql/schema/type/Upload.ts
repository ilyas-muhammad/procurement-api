import { GraphQLUpload } from 'apollo-server';
import { asNexusMethod, objectType } from 'nexus';

export const UploadInput = GraphQLUpload;

export const UploadSummary = objectType({
  name: 'UploadSummary',
  definition(t) {
    t.string('filename');
  },
});
