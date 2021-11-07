/**
* IdentityModels.tsx
* Copyright: Microsoft 2018
*
* Type definitions for user identities.
*/

export type UserId = string;

export interface UserMoralis{
    username:string;
    email:string;
    createdAt:string;
    sessionToken:string;
    emailVerified:boolean;
    updatedAt:string;
    avatar:string;
    objectId:string;
    ethAddress:string;
}
