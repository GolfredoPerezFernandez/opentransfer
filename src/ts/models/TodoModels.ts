/**
* TodoModels.tsx
* Copyright: Microsoft 2018
*
* Data models used with Todo sample app.
*/

export interface Todo {
    token_id: string;
    name: string;
    token_address: string;
    amount: string;
    owner_of: string;
    contract_type: string;
    symbol: string;
    token_uri: string;
    _searchTerms: string;
}

export interface Transfer {
    amount: string;
    block_hash:string;
    block_number: string;
    block_timestamp: string;
    contract_type: string;
    from_address:string;
    log_index: number
    operator: string;
    to_address:string;
    token_address: string;
    token_id:string;
    transaction_hash: string;
    transaction_index: number
    transaction_type: string;
    value: string;
}

export interface Owner2 {
    amount: string;
    block_number:string;
    contract_type: string;
    token_address: string;
    token_id: string;
    createdAt:string;
    updatedAt: string
    objectId: string;
}

export interface Winner {
    token_address: string;
    token_id:string;
    amount: string;
    owner_of: string;
    block_number: string;
    block_number_minted:string;
    contract_type: number
    token_uri: string;
    metadata:any;
    synced_at: string;
    name:string;
    ethscan:string;
    payed:boolean;
    type:string;
    symbol: string;
}

export interface Owner {
    token_address: string;
    token_id:string;
    amount: string;
    owner_of: string;
    block_number: string;
    block_number_minted:string;
    contract_type: number
    token_uri: string;
    metadata:any;
    synced_at: string;
    name:string;
    symbol: string;
}
