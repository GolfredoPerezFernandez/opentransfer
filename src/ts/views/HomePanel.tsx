/**
* CreateTodoPanel.tsx
* Copyright: Microsoft 2017
*
* The Todo item edit view.
*/

import * as RX from 'reactxp';

import { Colors, Fonts, FontSizes, Styles } from '../app/Styles';
import CurrentUserStore from '../stores/CurrentUserStore';
interface CreateTodoPanelProps extends RX.CommonProps {
}

interface CreateTodoPanelState {
    todoText: string;
    isLogin: boolean;
}

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        padding: 16,
    }),
    todoText: RX.Styles.createTextStyle({
        margin: 8,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch',
        color: Colors.black,
        backgroundColor: 'transparent',
    }),
    editTodoItem: RX.Styles.createTextInputStyle({
        margin: 8,
        height: 32,
        paddingHorizontal: 4,
        fontSize: FontSizes.size16,
        alignSelf: 'stretch',
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


const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/server";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";
Moralis.start({ serverUrl, appId })

export default class HomePanel extends RX.Component<CreateTodoPanelProps, CreateTodoPanelState> {
    protected _buildState(props: CreateTodoPanelProps, initState: boolean): Partial<CreateTodoPanelState> {
        const partialState: Partial<CreateTodoPanelState> = {
            isLogin: CurrentUserStore.getLogin() ?? false,
        };
        return partialState;
    }

    render() {
        return (
            <RX.View useSafeInsets={true} style={[_styles.container, Styles.statusBarTopMargin]}>
                <RX.Text style={_styles.todoText}>
                    {'Welcome!'}
                </RX.Text>

            </RX.View>
        );
    }

    _onPressTodo = async (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation()
        await Moralis.enableWeb3()


        await Moralis.Web3.authenticate().then(async (user: any) => {
            let username = user.get('username')
            let createdAt = user.get('createdAt')
            let sessionToken = user.get('sessionToken')
            let updatedAt = user.get('updatedAt')
            let address = user.get('ethAddress')


            if (address !== '') {
                CurrentUserStore.setLogin(true)

                CurrentUserStore.setUser(username, '', createdAt, sessionToken, updatedAt, '', address)
            }
            return
        })


        CurrentUserStore.setLogin(false)
        return
    };
}
