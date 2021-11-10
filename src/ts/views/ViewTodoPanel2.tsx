/**
* ViewTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import NavContextStore from '../stores/NavContextStore';
import { Fonts, FontSizes } from '../app/Styles';
import { Winner } from '../models/TodoModels';
import TodosStore from '../stores/TodosStore';
import CurrentUserStore from '../stores/CurrentUserStore';
const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId })
export interface ViewTodoPanelProps extends RX.CommonProps {
    todoId: string;
}

interface ViewTodoPanelState {
    todo: Winner;
    isLogin: boolean;
    amount: any; isTransfer: boolean;
}

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        margin: 16,
    }),
    todoText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
    }),
    buttonContainer: RX.Styles.createViewStyle({
        margin: 8,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }),
    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size12,
        color: 'black',
    })
};

import * as UI from '@sproutch/ui';
import * as NumericInput from "react-numeric-input";

export default class ViewTodoPanel2 extends ComponentBase<ViewTodoPanelProps, ViewTodoPanelState> {
    protected _buildState(props: ViewTodoPanelProps, initState: boolean): Partial<ViewTodoPanelState> {
        const newState: Partial<ViewTodoPanelState> = {
            amount: 0,
            isLogin: CurrentUserStore.getLogin(),

            isTransfer: CurrentUserStore.getTransfer(),
            todo: CurrentUserStore.getActive2() === 'gold' ? TodosStore.getWinnerGoldById(props.todoId) : CurrentUserStore.getActive2() === 'silver' ? TodosStore.getWinnerSilverById(props.todoId) : TodosStore.getWinnerBronzeById(props.todoId)
        };

        return newState;
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
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.owner_of : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_id : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.amount : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_uri : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.contract_type : ''}
                </RX.Text>
                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.token_address : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? this.state.todo.type : ''}
                </RX.Text>

                <RX.Text style={_styles.todoText}>
                    {this.state.todo ? "paid out " + this.state.todo?.payed : ''}
                </RX.Text>
                {!this.state.todo.payed ?
                    <RX.View style={{ width: 200 }}>
                        <NumericInput height={34} size={5} snap step={0.05} min={0.0001} max={9999999} onChange={this.setPrice} value={this.amount} />
                    </RX.View> : null}
                {!this.state.todo?.payed ? this.state.isTransfer === true ? <UI.Spinner color='black' size='medium' /> :
                    <UI.Button onPress={() => this.onPressSend()} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 200, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
                    } elevation={4} variant={"outlined"} label="Send Eth" /> : null}
                {this.state.todo?.payed ?
                    <RX.View style={{ width: 200 }}>
                        <UI.Button onPress={() => this.onScan()} style={{ root: [{ marginLeft: 15, height: 35 }], content: [{ width: 150, borderRadius: 11, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label="See in Ethscan" />
                    </RX.View> : null}
            </RX.View>
        );
    }
    private amount = 0.01
    private async onPressSend() {
        CurrentUserStore.setTransfer(true)
        await Moralis.enableWeb3()
        console.log(this.state.amount.toString())


        const options = { type: "native", amount: Moralis.Units.ETH(this.amount.toString()), receiver: this.state.todo.owner_of }
        let result = await Moralis.transfer(options)
        console.log(JSON.stringify(result))
        let type = this.state.todo.type
        let winner = type == 'gold' ? 'WinnersGold' : type == 'silver' ? 'WinnersSilver' : 'WinnersBronze';

        const Monster = Moralis.Object.extend(winner);
        const query = new Moralis.Query(Monster);
        query.equalTo("owner_of", this.state.todo.owner_of)
        const queryResult = await query.first();
        console.log(queryResult)
        console.log(JSON.stringify("hash" + result.transactionHash))
        if (queryResult) {

            queryResult.set('payed', true)
            queryResult.set('ethscan', "https://rinkeby.etherscan.io/tx/" + result.transactionHash)
            await queryResult.save()
            let winner1 = await this.getWinnersGold()
            await TodosStore.setWinnersGold(winner1)

            let winner2 = await this.getWinnersSilver()

            await TodosStore.setWinnersSilver(winner2)


            let winner3 = await this.getWinnersBronze()
            await TodosStore.setWinnersBronze(winner3)


            NavContextStore.navigateToTodoList()


        }

        CurrentUserStore.setTransfer(false)
        return
    }

    private async onScan() {
        let type = this.state.todo.type
        let winner = type == 'gold' ? 'WinnersGold' : type == 'silver' ? 'WinnersSilver' : 'WinnersBronze';

        const Monster = Moralis.Object.extend(winner);
        const query = new Moralis.Query(Monster);
        query.equalTo("owner_of", this.state.todo.owner_of)

        const queryResult = await query.first();
        console.log(this.state.todo.ethscan)
        RX.Linking.openUrl(queryResult.get('ethscan'));

        return
    }

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
    private setPrice = (newText: any) => {
        this.amount = newText;
    };
}
