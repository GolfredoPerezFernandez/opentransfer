/**
* TodoListPanel.tsx
* Copyright: Microsoft 2018
*
* Display first screen of the Todo application.
*/

import * as _ from 'lodash';
import * as RX from 'reactxp';
import { VirtualListView, VirtualListViewItemInfo } from 'reactxp-virtuallistview';
import { VirtualListCellRenderDetails } from 'reactxp-virtuallistview/dist/VirtualListCell';
import { ComponentBase } from 'resub';
import { Colors, Fonts, FontSizes } from '../app/Styles';

import { Owner } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';

import TodoListItem from './TodoListItem';

interface TodoListItemInfo extends VirtualListViewItemInfo {
    todo: Owner;
}

export interface TodoListPanelProps extends RX.CommonProps {
    selectedTodoId?: string;
    onSelect: (selectedId: string) => void;
    onCreateNew: () => void;
}

interface TodoListPanelState {
    todos: TodoListItemInfo[];
    filteredTodoList: TodoListItemInfo[];
    searchString: string;
    activeId: string;
    randomNumber: number;
    newBuyers: number;
    isLogin: boolean;
    tokenAddress: string;
    ownersDBGold: Owner[];
    ownersDBSilver: Owner[];
    ownersDBBronze: Owner[];
    ownersGold: number;
    ownersSilver: number;
    ownersBronze: number; isTiny: boolean;
    loading: boolean;
}

const _listItemHeight = 48;

const _styles = {
    listScroll: RX.Styles.createViewStyle({
        flexDirection: 'column',
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground,
    }),
    todoListHeader2: RX.Styles.createViewStyle({
        height: 120,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }),
    todoListHeader: RX.Styles.createViewStyle({
        height: 100,
        flexDirection: 'column',
        alignItems: 'center',
    }),
    searchBox: RX.Styles.createTextInputStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size14,
        borderWidth: 1,
        borderColor: Colors.borderSeparator,
        flex: 1,
        padding: 4,
        marginLeft: 12,
    }),
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: Colors.contentBackground,
    }),
    addTodoButton: RX.Styles.createViewStyle({
        margin: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    }),
    text1: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        color: 'black',
    }),
    buttonText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        lineHeight: 32,
        color: Colors.buttonTextColor,
    }),
    buttonTextHover: RX.Styles.createTextStyle({
        color: Colors.buttonTextHover,
    }),

    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size14,
        color: 'black',
    }),
};
import * as UI from '@sproutch/ui';
import CurrentUserStore from '../stores/CurrentUserStore';
import NavContextStore from '../stores/NavContextStore';

const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId })


export default class TodoListPanel extends ComponentBase<TodoListPanelProps, TodoListPanelState> {
    protected _buildState(props: TodoListPanelProps, initState: boolean): Partial<TodoListPanelState> | undefined {
        const partialState: Partial<TodoListPanelState> = {
            tokenAddress: '',
            isLogin: CurrentUserStore.getLogin(),
            ownersGold: TodosStore.getOwnersGold().length,
            ownersSilver: TodosStore.getOwnersSilver().length,
            ownersBronze: TodosStore.getOwnersBronze().length,
            ownersDBGold: TodosStore.getDBOwnersGold(),
            ownersDBSilver: TodosStore.getDBOwnersSilver(),
            ownersDBBronze: TodosStore.getDBOwnersBronze(),
            activeId: CurrentUserStore.getActive(),
            newBuyers: CurrentUserStore.getTotalBuyers(),
            loading: CurrentUserStore.getLoading(),
            isTiny: NavContextStore.isUsingStackNav(),
            randomNumber: CurrentUserStore.getRandomNumber(),
        };

        partialState.todos = CurrentUserStore.getActive() === 'gold' ? TodosStore.getOwnersGold().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo
        })) : CurrentUserStore.getActive() === 'silver' ? TodosStore.getOwnersSilver().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo,
        })) : TodosStore.getOwnersBronze().map((todo, i) => ({
            key: i.toString(),
            height: _listItemHeight,
            template: 'todo',
            todo,
        }));

        if (initState) {
            partialState.searchString = '';
            partialState.filteredTodoList = partialState.todos;
        } else {
            const filter = _.trim(partialState.searchString);
            if (filter) {
                partialState.filteredTodoList = this._filterTodoList(partialState.todos, filter);
            } else {
                partialState.filteredTodoList = partialState.todos;
            }
        }

        return partialState;
    }
    componentDidMount() {
        if (this.state.isLogin === true) {

        } else {
            NavContextStore.navigateToTodoList(undefined, false, undefined, true)
        }
    }
    render() {
        return (
            <RX.View useSafeInsets={true} style={_styles.container}>



                <RX.View style={_styles.todoListHeader}>

                    <UI.Button onPress={this._onPressCreateNewTodo} style={{ root: [{ marginLeft: 10, marginRight: 35 }], content: [{ height: 37, backgroundColor: 'white', width: 350, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                    } elevation={4} variant={"outlined"} label="Open Sea SDK" />


                    <UI.Button onPress={this._onPressCreateNewTodo2} style={{ root: [{ marginLeft: 10, marginRight: 35 }], content: [{ height: 37, backgroundColor: 'white', width: 350, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                    } elevation={4} variant={"outlined"} label="Refresh All" />
                </RX.View>


                <RX.View style={_styles.todoListHeader2}>




                    <RX.Text style={[_styles.text1, { marginTop: 20 }]} >
                        {'Total owners: ' + this.state.todos.length}
                    </RX.Text>

                    <RX.Text style={[_styles.text1, { marginTop: 10, marginBottom: 10 }]} >
                        {'New owners: ' + (this.state.activeId === "gold" ? Math.abs(this.state.todos.length - this.state.ownersDBGold.length) : this.state.activeId === "silver" ? Math.abs(this.state.todos.length - this.state.ownersDBSilver.length) : Math.abs(this.state.todos.length - this.state.ownersDBBronze.length))}
                    </RX.Text>
                    {(this.state.activeId === "gold" ? Math.abs(this.state.todos.length - this.state.ownersDBGold.length) : this.state.activeId === "silver" ? Math.abs(this.state.todos.length - this.state.ownersDBSilver.length) : Math.abs(this.state.todos.length - this.state.ownersDBBronze.length)) >= 10 ?
                        this.state.loading ? <UI.Spinner style={{ alignSelf: 'center' }} size='medium' color={'black'} /> : <UI.Button onPress={this.state.activeId === 'gold' ? this._onPressGold : this.state.activeId === 'silver' ? this._onPressSilver : this._onPressBronze} style={{ root: [{}], content: [{ height: 37, backgroundColor: 'white', width: 150, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label="Get Winners" /> : null}
                </RX.View>

                <RX.View style={{ flexDirection: 'row', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    {this.state.activeId === 'gold' ?
                        <UI.Button onPress={() => this.goToGold()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.ownersGold + ")"} /> :
                        <UI.Button onPress={() => this.goToGold()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Gold " + "(" + this.state.ownersGold + ")"} />}

                    {this.state.activeId === 'silver' ?
                        <UI.Button onPress={() => this.goToSilver()} palette='primary' style={{ root: [{}], content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.ownersSilver + ")"} /> :
                        <UI.Button onPress={() => this.goToSilver()} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'white' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Silver " + "(" + this.state.ownersSilver + ")"} />}

                    {this.state.activeId === 'bronze' ?
                        <UI.Button onPress={() => this.goToBronze()} palette={'primary'} style={{ content: [{ borderRadius: 0, borderWidth: 0, width: 133, backgroundColor: 'gray' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.ownersBronze + ")"} /> :
                        <UI.Button onPress={() => this.goToBronze()} style={{ content: [{ borderRadius: 0, width: 133, borderWidth: 0, backgroundColor: 'white', }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label={"Bronze " + "(" + this.state.ownersBronze + ")"} />}

                </RX.View>

                <VirtualListView
                    itemList={this.state.filteredTodoList}
                    renderItem={this._renderItem}
                    style={_styles.listScroll}
                />
            </RX.View>
        );
    }

    async goToGold() {

        CurrentUserStore.setActive('gold')
    }
    async goToSilver() {

        CurrentUserStore.setActive('silver')
    }
    async goToBronze() {

        CurrentUserStore.setActive('bronze')
    }

    private _filterTodoList(sortedTodos: TodoListItemInfo[], searchString: string): TodoListItemInfo[] {
        const lowerSearchString = searchString.toLowerCase();

        return _.filter(sortedTodos, item => {
            const todoLower = item.todo.owner_of.toLowerCase();
            return todoLower.search(lowerSearchString) >= 0;
        });
    }

    private _renderItem = (details: VirtualListCellRenderDetails<TodoListItemInfo>) => {
        const item = details.item;
        return (
            <TodoListItem
                todo={item.todo}
                height={_listItemHeight}
                isSelected={item.todo.token_id === this.props.selectedTodoId}
                searchString={this.state.searchString}
                onPress={this._onPressTodo}
            />
        );
    };

    private _onPressTodo = (todoId: string) => {
        this.props.onSelect(todoId);
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos,
        });
    };


    private _onPressBronze = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808851027999851496", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        await Moralis.enableWeb3()
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersBronze");

            const Owner = Moralis.Object.extend("OwnersBronze");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {


                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //


                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let win = counter + Math.round(newint)

                        for (let j = 0; j < 10; j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j + counter].token_address,
                                token_id: tokenIdOwnersGold.result[j + counter].token_id,
                                amount: tokenIdOwnersGold.result[j + counter].amount,
                                owner_of: tokenIdOwnersGold.result[j + counter].owner_of,
                                block_number: tokenIdOwnersGold.result[j + counter].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j + counter].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j + counter].contract_type,
                                token_uri: tokenIdOwnersGold.result[j + counter].token_uri,
                                metadata: tokenIdOwnersGold.result[j + counter].metadata,
                                synced_at: tokenIdOwnersGold.result[j + counter].synced_at,
                                name: tokenIdOwnersGold.result[j + counter].name,

                                symbol: tokenIdOwnersGold.result[j + counter].symbol,
                            })
                        }

                        const winner = new Winner();
                        winner.save({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            ethscan: '',
                            type: 'bronze',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                        })

                        TodosStore.addBronzeWinner({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            type: 'bronze',
                            ethscan: '',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                        });
                        counter = counter + 10
                    }

                    const ownedItems = await Moralis.Cloud.run('getDBBronze')
                    TodosStore.setDBOwnersBronze(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        } else {
            try {
                return await Moralis.Web3.authenticate().then(async (user: any) => {

                    CurrentUserStore.setLoading(false)
                })
            } catch {


                CurrentUserStore.setLoading(false)
                return
            }

        }

    };
    private _onPressSilver = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808852127511479272", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        await Moralis.enableWeb3()
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersSilver");

            const Owner = Moralis.Object.extend("OwnersSilver");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {

                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //


                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let win = counter + Math.round(newint)

                        for (let j = 0; j < 10; j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j + counter].token_address,
                                token_id: tokenIdOwnersGold.result[j + counter].token_id,
                                amount: tokenIdOwnersGold.result[j + counter].amount,
                                owner_of: tokenIdOwnersGold.result[j + counter].owner_of,
                                block_number: tokenIdOwnersGold.result[j + counter].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j + counter].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j + counter].contract_type,
                                token_uri: tokenIdOwnersGold.result[j + counter].token_uri,
                                metadata: tokenIdOwnersGold.result[j + counter].metadata,
                                synced_at: tokenIdOwnersGold.result[j + counter].synced_at,
                                name: tokenIdOwnersGold.result[j + counter].name,

                                symbol: tokenIdOwnersGold.result[j + counter].symbol,
                            })
                        }

                        const winner = new Winner();
                        winner.save({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            ethscan: '',
                            type: 'silver',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                        })

                        TodosStore.addSilverWinner({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            ethscan: '',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                            type: 'silver'
                        });
                        counter = counter + 10
                    }


                    const ownedItems = await Moralis.Cloud.run('getDBSilver')
                    TodosStore.setDBOwnersSilver(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        } else {
            try {
                return await Moralis.Web3.authenticate().then(async (user: any) => {

                    CurrentUserStore.setLoading(false)
                })
            } catch {


                CurrentUserStore.setLoading(false)
                return
            }

        }
    };
    private getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    private _onPressGold = async () => {
        const options3 = { address: "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656", token_id: "16923634234309235305936278977612378847065311654836719990863808853227023106548", chain: "rinkeby" };
        CurrentUserStore.setLoading(true)
        await Moralis.enableWeb3()
        let user = await Moralis.User.current();


        if (user) {

            const tokenIdOwnersGold = await Moralis.Web3API.token.getTokenIdOwners(options3);

            const Winner = Moralis.Object.extend("WinnersGold");

            const Owner = Moralis.Object.extend("OwnersGold");
            const query = new Moralis.Query(Owner)
            query.limit(500)
            const queryResults = await query.find();




            if ((tokenIdOwnersGold.result.length - queryResults.length) >= 10) {



                var resto = (tokenIdOwnersGold.result.length - queryResults.length) / 10;


                var fract = resto * 10 % 10 / 10; //0.2
                var integr = resto - fract; //
                let counter = queryResults.length;

                if (integr >= 1) {
                    for (let i = 0; i < integr; i++) {

                        let rand = this.getRandomArbitrary(1, 0 + 11);

                        var fract = rand * 10 % 10 / 10; //0.2
                        var newint = rand - fract; //
                        let win = counter + Math.round(newint)

                        for (let j = 0; j < 10; j++) {

                            const owner = new Owner();
                            await owner.save({
                                token_address: tokenIdOwnersGold.result[j + counter].token_address,
                                token_id: tokenIdOwnersGold.result[j + counter].token_id,
                                amount: tokenIdOwnersGold.result[j + counter].amount,
                                owner_of: tokenIdOwnersGold.result[j + counter].owner_of,
                                block_number: tokenIdOwnersGold.result[j + counter].block_number,
                                block_number_minted: tokenIdOwnersGold.result[j + counter].block_number_minted,
                                contract_type: tokenIdOwnersGold.result[j + counter].contract_type,
                                token_uri: tokenIdOwnersGold.result[j + counter].token_uri,
                                metadata: tokenIdOwnersGold.result[j + counter].metadata,
                                synced_at: tokenIdOwnersGold.result[j + counter].synced_at,
                                name: tokenIdOwnersGold.result[j + counter].name,

                                symbol: tokenIdOwnersGold.result[j + counter].symbol,
                            })
                        }

                        const winner = new Winner();
                        winner.save({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            ethscan: '',
                            type: 'gold',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                        })

                        TodosStore.addGoldWinner({
                            token_address: tokenIdOwnersGold.result[win].token_address,
                            token_id: tokenIdOwnersGold.result[win].token_id,
                            amount: tokenIdOwnersGold.result[win].amount,
                            owner_of: tokenIdOwnersGold.result[win].owner_of,
                            block_number: tokenIdOwnersGold.result[win].block_number,
                            block_number_minted: tokenIdOwnersGold.result[win].block_number_minted,
                            contract_type: tokenIdOwnersGold.result[win].contract_type,
                            token_uri: tokenIdOwnersGold.result[win].token_uri,
                            metadata: tokenIdOwnersGold.result[win].metadata,
                            synced_at: tokenIdOwnersGold.result[win].synced_at,
                            name: tokenIdOwnersGold.result[win].name,
                            payed: false,
                            ethscan: '',
                            type: 'gold',
                            symbol: tokenIdOwnersGold.result[win].symbol,
                        });
                        counter = counter + 10
                    }



                    const ownedItems = await Moralis.Cloud.run('getDBGold')
                    TodosStore.setDBOwnersGold(ownedItems)
                    CurrentUserStore.setLoading(false)
                    return

                }
            }
            CurrentUserStore.setLoading(false)
            return


        } else {
            try {
                return await Moralis.Web3.authenticate().then(async (user: any) => {

                    CurrentUserStore.setLoading(false)
                })
            } catch {


                CurrentUserStore.setLoading(false)
                return
            }

        }
    }
    private _onPressCreateNewTodo2 = async () => {

        await TodosStore.setOwnersGold(await this.getGold())
        await TodosStore.setOwnersSilver(await this.getSilver())
        await TodosStore.setOwnersBronze(await this.getBronze())

        await TodosStore.setDBOwnersGold(await this.getDBGold())

        await TodosStore.setDBOwnersBronze(await this.getDBBronze())
        await TodosStore.setDBOwnersSilver(await this.getDBSilver())

        await TodosStore.setWinnersGold(await this.getWinnersGold())
        await TodosStore.setWinnersSilver(await this.getWinnersSilver())
        await TodosStore.setWinnersBronze(await this.getWinnersBronze())

    };

    getWinnersSilver = async () => {

        const ownedItems = await Moralis.Cloud.run('getWinnersSilver')
        return ownedItems;
    }
    getWinnersGold = async () => {

        const ownedItems = await Moralis.Cloud.run('getWinnersGold')
        return ownedItems;
    }
    getWinnersBronze = async () => {

        const ownedItems = await Moralis.Cloud.run('getWinnersBronze')
        return ownedItems;
    }
    private _onPressCreateNewTodo = async () => {

        this.props.onCreateNew();
        this.setState({
            searchString: '',
            filteredTodoList: this.state.todos,
        });
    };


    getBronze = async () => {

        const ownedItems = await Moralis.Cloud.run('getBronze')
        return ownedItems;
    }


    getSilver = async () => {
        const ownedItems = await Moralis.Cloud.run('getSilver')
        return ownedItems;

    }


    getGold = async () => {
        const ownedItems = await Moralis.Cloud.run('getGold')
        return ownedItems;

    }

    getDBBronze = async () => {

        const ownedItems = await Moralis.Cloud.run('getDBBronze')
        return ownedItems;
    }


    getDBSilver = async () => {
        const ownedItems = await Moralis.Cloud.run('getDBSilver')
        return ownedItems;

    }



    getDBGold = async () => {

        const ownedItems = await Moralis.Cloud.run('getDBGold')
        return ownedItems;

    }
}
