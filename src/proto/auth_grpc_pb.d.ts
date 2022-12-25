// package: auth
// file: proto/auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as proto_auth_pb from "../proto/auth_pb";

interface IAuthService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    loginUser: IAuthService_ILoginUser;
}

interface IAuthService_ILoginUser extends grpc.MethodDefinition<proto_auth_pb.LoginRequest, proto_auth_pb.LoginResponse> {
    path: "/auth.Auth/LoginUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_auth_pb.LoginRequest>;
    requestDeserialize: grpc.deserialize<proto_auth_pb.LoginRequest>;
    responseSerialize: grpc.serialize<proto_auth_pb.LoginResponse>;
    responseDeserialize: grpc.deserialize<proto_auth_pb.LoginResponse>;
}

export const AuthService: IAuthService;

export interface IAuthServer extends grpc.UntypedServiceImplementation {
    loginUser: grpc.handleUnaryCall<proto_auth_pb.LoginRequest, proto_auth_pb.LoginResponse>;
}

export interface IAuthClient {
    loginUser(request: proto_auth_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    loginUser(request: proto_auth_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    loginUser(request: proto_auth_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
}

export class AuthClient extends grpc.Client implements IAuthClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public loginUser(request: proto_auth_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    public loginUser(request: proto_auth_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    public loginUser(request: proto_auth_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_auth_pb.LoginResponse) => void): grpc.ClientUnaryCall;
}
