/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { SignupRequest } from '../models/SignupRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * @param requestBody
     * @returns string
     * @throws ApiError
     */
    public static postSignup(
        requestBody: SignupRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/signup',
            body: requestBody,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    /**
     * @param requestBody
     * @returns string
     * @throws ApiError
     */
    public static postLogin(
        requestBody: LoginRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    /**
     * @returns string
     * @throws ApiError
     */
    public static getHello(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/hello',
        });
    }

}
