import { IResolvers } from 'graphql-tools';
import queries from './queries';
import mutations from './mutations';

const resolversMap: IResolvers = {
    ...queries,
    ...mutations
};
export default resolversMap;