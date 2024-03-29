/**
* CurrentUserStore.tsx
* Copyright: Microsoft 2018
*
* Singleton store that maintains information about the currently-signed-in user.
*/

import { autoSubscribe, AutoSubscribeStore, StoreBase } from 'resub';

import { UserMoralis } from '../models/IdentityModels';


@AutoSubscribeStore
export class CurrentUserStore extends StoreBase {
    // TODO - properly initialize
  private loading=false
  private isLogin=false
  private random=0
    private _userMoralis: UserMoralis = {
        createdAt: '',
        updatedAt: '',
        emailVerified: false,
        sessionToken: '',
        email: '',
        username: '',
        objectId:'',
        avatar:'',
        ethAddress:''
    }
    private transfer=false
    @autoSubscribe
    getTransfer(): boolean {
        return this.transfer
    }
    
    setTransfer(isMarket:boolean) { 
 
        this.transfer = isMarket
        this.trigger()
    }
    private _cargando=false
    @autoSubscribe
    getCargando(): boolean {
        return this._cargando
    }
    
    setCargando(isMarket:boolean) { 
 
        this._cargando = isMarket
        this.trigger()
    }
    setUser(username:string,email:string,createdAt:string,sessionToken:string,updatedAt:string,avatar:string,ethAddress:string) { 
       
        this._userMoralis = {
            createdAt,
            updatedAt,
            emailVerified: false,
            sessionToken,
            email,
            username,
            objectId:'',
            avatar ,
            ethAddress,
        };
        this.trigger();

    }
    private _wallet: string = ''
    private totalBuyers: number = 0
    @autoSubscribe
    getLogin() {

        return this.isLogin
    }
    setLogin(password: boolean) {
        this.isLogin = password
        this.trigger()
    }
    private activeId2: string = 'gold'
    @autoSubscribe
    getActive2() {

        return this.activeId2
    }
    setActive2(password: string) {
        this.activeId2 = password
        this.trigger()
    }
    private activeId: string = 'gold'
    @autoSubscribe
    getActive() {

        return this.activeId
    }
    setActive(password: string) {
        this.activeId = password
        this.trigger()
    }
    setWalletAddress(item:string) { 
 
        this._wallet = item
        this.trigger()
    }
    setTotalBuyers(item:number) { 
 
        this.totalBuyers = item
        this.trigger()
    }
    @autoSubscribe
    getTotalBuyers(): number {
        return this.totalBuyers
    }
    setRandomNumber(item:number) { 
 
        this.random = item
        this.trigger()
    }
    @autoSubscribe
    getRandomNumber(): number {
        return this.random
    }
    setLoading(item:boolean) { 
 
        this.loading = item
        this.trigger()
    }
    @autoSubscribe
    getLoading(): boolean {
        return this.loading
    }
    @autoSubscribe
    getWalletAddress(): string {
        return this._wallet
    }
    private _isRinkeby: boolean = false
    setRinkeby(item:boolean) { 
 
        this._isRinkeby = item
        this.trigger()
    }
    @autoSubscribe
    getRinkeby(): boolean {
        return this._isRinkeby
    }
    private _isMetamask = false
    setMetamask(isMarket:boolean) { 
 
        this._isMetamask = isMarket
        this.trigger()
    }
    @autoSubscribe
    getMetamask(): boolean {
        return this._isMetamask
    }

    @autoSubscribe
    getUser(): UserMoralis {
        return this._userMoralis
    }

    @autoSubscribe
    getEthAddress(): string {
        return this._userMoralis.ethAddress;
    }
}

export default new CurrentUserStore();
