/*
* TopBarStack.tsx
* Copyright: Microsoft 2018
*
* Horizontal bar that appears on the top of every view within the app
* when it's using stack-based layout.
*/

import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import HoverButton from '../controls/HoverButton';
import { Colors, Fonts, FontSizes, Styles } from '../app/Styles';
import CurrentUserStore from '../stores/CurrentUserStore';
import { UserMoralis } from '../models/IdentityModels';
import AccountMenuButton2 from './AccountMenuButton2';
import NavContextStore from '../stores/NavContextStore';

const _styles = {
    background: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 47,
        borderBottomWidth: 1,
        borderColor: Colors.gray66,
        flexDirection: 'row',
        justifyContent: 'center',
    }),
    leftRightContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
        width: 160,
    }),
    titleContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
    }),
    titleText: RX.Styles.createTextStyle({
        flex: -1,
        font: Fonts.displaySemibold,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
        textAlign: 'center',
    }),
    backText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
        margin: 8,
    }),
    backTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover,
    }),
    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size12,
        color: 'black',
    })
};

export interface TopBarStackProps extends RX.CommonProps {
    title: string;
    showBackButton: boolean;
    onBack?: () => void;
}

interface TopBarCompositeState {
    isLogin: boolean;
    isWinners: boolean;
    isCargando: boolean;
    user: UserMoralis;
}
const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/serve";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";

Moralis.start({ serverUrl, appId });


import * as UI from '@sproutch/ui';
import ImageSource from 'modules/images';
import TodosStore from '../stores/TodosStore';
export default class TopBarStack extends ComponentBase<TopBarStackProps, TopBarCompositeState> {
    protected _buildState(props: TopBarStackProps, initState: boolean): Partial<TopBarCompositeState> | undefined {
        const partialState: Partial<TopBarCompositeState> = {
            isLogin: CurrentUserStore.getLogin(),
            user: CurrentUserStore.getUser(),
            isWinners: TodosStore.getIsWinners(),
            isCargando: CurrentUserStore.getCargando(),
        };
        return partialState;
    }

    private _onPressCreateNewTodo4 = async () => {

        TodosStore.setIsWinners(false)
        NavContextStore.navigateToTodoList()
    };
    private _onPressCreateNewTodo3 = async () => {
        NavContextStore.navigateToTodoList()
        TodosStore.setIsWinners(true)
    };
    _onPressTodo = async (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation()
        CurrentUserStore.setCargando(true)

        await Moralis.enableWeb3()

        try {

            await Moralis.switchNetwork('0x4');

            await Moralis.authenticate().then(async (user: any) => {
                let username = user.get('username')
                let createdAt = user.get('createdAt')
                let sessionToken = user.get('sessionToken')
                let updatedAt = user.get('updatedAt')
                let address = user.get('ethAddress')


                let avatar = user.get('avatar')


                if (avatar === undefined) {


                    CurrentUserStore.setUser(username, '', createdAt, sessionToken, updatedAt, '', address)
                    CurrentUserStore.setLogin(true)

                } else {

                    CurrentUserStore.setUser(username, '', createdAt, sessionToken, updatedAt, avatar, address)
                    CurrentUserStore.setLogin(true)
                }
                NavContextStore.navigateToTodoList()

                CurrentUserStore.setCargando(false)
            })
            return
        } catch {


            CurrentUserStore.setCargando(false)
        }

    };
    render(): JSX.Element | null {
        let leftContents: JSX.Element | undefined;
        if (this.props.showBackButton) {
            leftContents = (
                <HoverButton onPress={this._onPressBack} onRenderChild={this._renderBackButton} />
            );
        }

        async function onLogOut() {

            TodosStore.setIsWinners(false)
            CurrentUserStore.setLogin(false)
            CurrentUserStore.setUser('', '', '', '', '', '', '')


            CurrentUserStore.setCargando(false)
            NavContextStore.navigateToTodoList(undefined, false, undefined, true)
            await Moralis.User.logOut();
        }
        return (
            <RX.View style={[_styles.background, Styles.statusBarTopMargin]}>
                <RX.View style={_styles.leftRightContainer}>
                    {leftContents}

                    {this.state.isLogin && !this.state.isWinners ?
                        <UI.Button onPress={this._onPressCreateNewTodo3} style={{ root: [{ marginLeft: 20, marginRight: 0 }], content: [{ height: 37, backgroundColor: 'white', width: 100, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label="Winners List" /> : null}
                    {this.state.isWinners ?
                        <UI.Button onPress={this._onPressCreateNewTodo4} style={{ root: [{ marginLeft: 20, marginRight: 0 }], content: [{ height: 37, backgroundColor: 'white', width: 100, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                        } elevation={4} variant={"outlined"} label="Owners List" /> : null}
                </RX.View>
                <RX.View style={_styles.titleContainer}>
                    <RX.Text style={_styles.titleText} numberOfLines={1}>
                        {this.props.title}
                    </RX.Text>
                </RX.View>
                <RX.View style={_styles.leftRightContainer}>

                    {this.state.isLogin ?
                        <AccountMenuButton2 onLogOut={onLogOut} username={this.state.user.ethAddress} avatar={this.state.user.avatar === '' ? '' : this.state.user.avatar} onPress={() => null} />
                        : this.state.isCargando ? <RX.View style={{ width: 150, marginRight: 20, justifyContent: 'center', alignItems: 'center', }}> <UI.Spinner color='black' size='medium' /></RX.View> :
                            <UI.Button onPress={this._onPressTodo} iconSlot={iconStyle => (
                                <RX.Image source={ImageSource.fox} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 18, height: 18 }} />
                            )} style={{ root: [{ marginRight: 20 }], content: [{ width: 100, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                            } elevation={4} variant={"outlined"} label="Metamask" />
                    }
                </RX.View>
            </RX.View>
        );
    }

    private _onPressBack = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        if (this.props.onBack) {
            this.props.onBack();
        }
    };

    private _renderBackButton = (isHovering: boolean) => (
        <RX.Text style={[_styles.backText, isHovering ? _styles.backTextHover : undefined]}>
            {'Back'}
        </RX.Text>
    );
}
