/**
* TodosStore.tsx
* Copyright: Microsoft 2017
*
* Resub Basic Example https://github.com/Microsoft/ReSub
*/

import * as _ from 'lodash';
import { autoSubscribe, AutoSubscribeStore, StoreBase } from 'resub';

import LocalDb from '../app/LocalDb';
import { Owner, Todo, Transfer, Winner } from '../models/TodoModels';

@AutoSubscribeStore
class TodosStore extends StoreBase {
    private _todos: Todo[] = [];

    private _isWinners: boolean = false;
    private _owners: Owner[] = [];
    private _transfers: Transfer[] = [];
    private _winners: Winner[] = [];

    private _ownersDBGold: Owner[] = [];
    private _ownersDBSilver: Owner[] = [];
    private _ownersDBBronze: Owner[] = [];

    private _ownersGold: Owner[] = [];
    private _ownersSilver: Owner[] = [];
    private _ownersBronze: Owner[] = [];


    private _winnersGold: Winner[] = [];
    private _winnersSilver: Winner[] = [];
    private _winnersBronze: Winner[] = [];


    startup() {


        LocalDb.getAllWinnersGold().then((todos: Winner[]) => {
            this._winnersGold = todos;
        })
        LocalDb.getAllWinnersBronze().then((todos: Winner[]) => {
            this._winnersBronze = todos;
        })
        LocalDb.getAllWinnersSilver().then((todos: Winner[]) => {
            this._winnersSilver = todos;
        });

        LocalDb.getAllDBGold().then((todos: Owner[]) => {
            this._ownersDBGold = todos;
        })
        LocalDb.getAllDBBronze().then((todos: Owner[]) => {
            this._ownersDBBronze = todos;
        })
        LocalDb.getAllDBSilver().then((todos: Owner[]) => {
            this._ownersDBSilver = todos;
        });
        return LocalDb.getAllGold().then((todos: Owner[]) => {
            this._ownersGold = todos;
        }) &&
            LocalDb.getAllBronze().then((todos: Owner[]) => {
                this._ownersBronze = todos;
            }) &&
            LocalDb.getAllSilver().then((todos: Owner[]) => {
                this._ownersSilver = todos;
            })

    }
    @autoSubscribe
    setDBOwnersBronze(newTodos: Owner[]) {

        this._ownersDBBronze = newTodos

        this.trigger()
        return this._ownersDBBronze;
    }
    @autoSubscribe
    setIsWinners(newTodos: boolean) {

        this._isWinners = newTodos

        this.trigger()
        return this._isWinners;
    }

    @autoSubscribe
    getIsWinners() {
        return this._isWinners;
    }

    @autoSubscribe
    getDBOwnersBronze() {
        return this._ownersDBBronze;
    }
    @autoSubscribe
    setDBOwnersSilver(newTodos: Owner[]) {

        this._ownersDBSilver = newTodos

        this.trigger()
        return this._ownersDBSilver;
    }

    @autoSubscribe
    getDBOwnersSilver() {
        return this._ownersDBSilver;
    }
    @autoSubscribe
    setDBOwnersGold(newTodos: Owner[]) {

        this._ownersDBGold = newTodos

        this.trigger()
        return this._ownersDBGold;
    }

    @autoSubscribe
    getDBOwnersGold() {
        return this._ownersDBGold;
    }
    @autoSubscribe
    setOwnersSilver(newTodos: Owner[]) {

        this._ownersSilver = newTodos

        this.trigger()
        return this._ownersSilver;
    }

    @autoSubscribe
    getOwnersSilver() {
        return this._ownersSilver;
    }

    @autoSubscribe
    setOwnersBronze(newTodos: Owner[]) {

        this._ownersBronze = newTodos

        this.trigger()
        return this._ownersBronze;
    }

    @autoSubscribe
    getOwnersBronze() {
        return this._ownersBronze;
    }

    @autoSubscribe
    setOwnersGold(newTodos: Owner[]) {

        this._ownersGold = newTodos

        this.trigger()
        return this._ownersGold;
    }

    @autoSubscribe
    getOwnersGold() {
        return this._ownersGold;
    }

    @autoSubscribe
    setWinnersGold(newTodos: Winner[]) {

        this._winnersGold = newTodos

        this.trigger()
        return this._winnersGold;
    }

    @autoSubscribe
    getWinnersGold() {
        return this._winnersGold;
    }

    @autoSubscribe
    setWinnersSilver(newTodos: Winner[]) {

        this._winnersSilver = newTodos

        this.trigger()
        return this._winnersSilver;
    }

    @autoSubscribe
    getWinnersSilver() {
        return this._winnersSilver;
    }
    @autoSubscribe
    setWinnersBronze(newTodos: Winner[]) {

        this._winnersBronze = newTodos

        this.trigger()
        return this._winnersBronze;
    }

    @autoSubscribe
    getWinnersBronze() {
        return this._winnersBronze;
    }
    @autoSubscribe
    setOwners(newTodos: Owner[]) {

        this._owners = newTodos

        this.trigger()
        return this._owners;
    }

    @autoSubscribe
    getOwners() {
        return this._owners;
    }
    addOwner(transfer: Owner) {
        if (transfer.owner_of != '0x256a7001f057d59cd792ff0a1e7d7c14bb0b19e6') {

            this._owners = this._owners.concat(transfer);
            this.trigger();

            return transfer;
        }

        // Asynchronously write the new todo item to the DB.
        return

    }


    @autoSubscribe
    getWinnerBronzeById(todoId: string) {
        return _.find(this._winnersBronze, todo => todo.owner_of === todoId);
    }
    @autoSubscribe
    getWinnerSilverById(todoId: string) {
        return _.find(this._winnersSilver, todo => todo.owner_of === todoId);
    }
    @autoSubscribe
    getWinnerGoldById(todoId: string) {
        return _.find(this._winnersGold, todo => todo.owner_of === todoId);
    }
    @autoSubscribe
    getOwnerGoldById(todoId: string) {
        return _.find(this._ownersGold, todo => todo.owner_of === todoId);
    }
    @autoSubscribe
    getOwnerSilverById(todoId: string) {
        return _.find(this._ownersSilver, todo => todo.owner_of === todoId);
    }

    @autoSubscribe
    getOwnerBronzeById(todoId: string) {
        return _.find(this._ownersBronze, todo => todo.owner_of === todoId);
    }



    @autoSubscribe
    setWinners(newTodos: Winner[]) {

        this._winners = newTodos;

        this.trigger()
        return this._winners;
    }
    addBronzeWinner(transfer: Winner) {
        this._winnersBronze = this._winnersBronze.concat(transfer);

        // Asynchronously write the new todo item to the DB.

        this.trigger();

        return transfer;
    }

    addGoldWinner(transfer: Winner) {
        this._winnersGold = this._winnersGold.concat(transfer);

        // Asynchronously write the new todo item to the DB.

        this.trigger();

        return transfer;
    }
    addSilverWinner(transfer: Winner) {
        this._winnersSilver = this._winnersSilver.concat(transfer);

        // Asynchronously write the new todo item to the DB.

        this.trigger();

        return transfer;
    }
    @autoSubscribe
    getWinners() {
        return this._winners;
    }
    @autoSubscribe
    setTransfers(newTodos: Transfer[]) {

        this._transfers = _.filter(newTodos, todo => todo.from_address === '0x256a7001f057d59cd792ff0a1e7d7c14bb0b19e6')

        this.trigger()
        return this._transfers;
    }

    @autoSubscribe
    getTransfers() {
        return this._transfers;
    }

    @autoSubscribe
    setTodos(newTodos: Todo[]) {
        this._todos = newTodos
        this.trigger()
        return this._todos;
    }
    @autoSubscribe
    getTodos() {
        return this._todos;
    }
    @autoSubscribe
    getTransferById(todoId: string) {
        return _.find(this._transfers, todo => todo.token_id === todoId);
    }

    @autoSubscribe
    getTodoById(todoId: string) {
        return _.find(this._todos, todo => todo.token_id === todoId);
    }

    deleteTodo(todoId: string) {
        this._todos = _.filter(this._todos, todo => todo.token_id !== todoId);

        // Asynchronously delete the todo item from the DB.
        LocalDb.deleteTodo(todoId);
        this.trigger();
    }
}

export default new TodosStore();
