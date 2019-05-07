// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
hello: string;
user: IUser | null;
users: Array<IUser>;
}

interface IHelloOnQueryArguments {
name?: string | null;
}

interface IUserOnQueryArguments {
email: string;
}

interface IUser {
__typename: "User";
id: string;
name: string;
email: string;
password: string;
}

interface IMutation {
__typename: "Mutation";
register: boolean | null;
}

interface IRegisterOnMutationArguments {
email: string;
password: string;
name: string;
}
}

// tslint:enable
