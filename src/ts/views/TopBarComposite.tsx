/*
* TopBarComposite.tsx
* Copyright: Microsoft 2018
*
* Horizontal bar that appears on the top of every view within the app
* when it's using composite layout (as opposed to stack-based layout).
*/

import ImageSource from 'modules/images';
import * as RX from 'reactxp';
import { ComponentBase } from 'resub';

import NavContextStore from '../stores/NavContextStore';
import { Colors, Fonts, FontSizes } from '../app/Styles';

import CurrentUserStore from '../stores/CurrentUserStore';

const _styles = {
    background: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        height: 100,
        borderBottomWidth: 1,
        borderColor: Colors.gray66,
        flexDirection: 'row',
        paddingHorizontal: 16,
    }),
    logoContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    }),
    barControlsContainer: RX.Styles.createViewStyle({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    }),
    logoImage: RX.Styles.createImageStyle({
        height: 24,
        width: 26,
    }),
    logoText: RX.Styles.createTextStyle({
        font: Fonts.displaySemibold,
        fontSize: FontSizes.size20,
        marginHorizontal: 4,
        color: Colors.logoColor,
    }),
    linkText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.menuItem,
        marginHorizontal: 8,
        color: Colors.menuText,
    }),
    linkTextHover: RX.Styles.createTextStyle({
        color: Colors.menuTextHover,
    }),
    backButtonContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
    }),
    backText: RX.Styles.createTextStyle({
        font: Fonts.displayRegular,
        fontSize: FontSizes.size16,
        color: Colors.menuText,
    }),
    label: RX.Styles.createTextStyle({
        font: Fonts.displayBold,
        fontSize: FontSizes.size12,
        color: 'black',
    })
};

import { UserMoralis } from '../models/IdentityModels';
interface TopBarCompositeState {
    isLogin: boolean;
    isMetamask: boolean;
    isCargando: boolean;
    user: UserMoralis;
}

export interface TopBarCompositeProps extends RX.CommonProps {
    showBackButton: boolean;
    onBack?: () => void;
}


const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/serve";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";

import AccountMenuButton2 from './AccountMenuButton2';
Moralis.start({ serverUrl, appId });
import * as UI from '@sproutch/ui';
export default class TopBarComposite extends ComponentBase<TopBarCompositeProps, TopBarCompositeState> {


    protected _buildState(props: TopBarCompositeProps, initState: boolean): Partial<TopBarCompositeState> | undefined {
        const partialState: Partial<TopBarCompositeState> = {
            isLogin: CurrentUserStore.getLogin(),
            user: CurrentUserStore.getUser(),
            isCargando: CurrentUserStore.getCargando(),
            isMetamask: CurrentUserStore.getMetamask(),
        };
        return partialState;
    }
    private async onLogOut() {

        CurrentUserStore.setLogin(false)
        CurrentUserStore.setUser('', '', '', '', '', '', '')


        CurrentUserStore.setCargando(false)
        NavContextStore.navigateToTodoList(undefined, false)
        await Moralis.User.logOut();
    }
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

                CurrentUserStore.setCargando(false)
            })
            return
        } catch {


            CurrentUserStore.setCargando(false)
        }

    };
    render(): JSX.Element | null {

        return (
            <RX.View style={_styles.background}>

                <RX.View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <RX.Button onPress={this._onPressLogo}>
                        <RX.View style={_styles.logoContainer}>
                            <RX.Image source={ImageSource.todoLogo} style={_styles.logoImage} />
                            <RX.Text style={_styles.logoText}>
                                {'OpenSeaTransfers'}
                            </RX.Text>
                        </RX.View>
                    </RX.Button>

                    {this.state.isLogin ?
                        <AccountMenuButton2 onLogOut={this.onLogOut} username={this.state.user.ethAddress} avatar={this.state.user.avatar === '' ? '' : this.state.user.avatar} onPress={() => null} />
                        : this.state.isCargando ? <RX.View style={{ width: 250, justifyContent: 'center', alignItems: 'center', marginLeft: 100, marginRight: 50 }}> <UI.Spinner color='black' size='medium' /></RX.View> :
                            <UI.Button onPress={this._onPressTodo} iconSlot={iconStyle => (
                                <RX.Image source={ImageSource.fox} style={{ marginTop: 0, alignSelf: 'center', marginRight: 5, width: 18, height: 18 }} />
                            )} style={{ root: [{}], content: [{ width: 250, marginBottom: 5, borderRadius: 11, }], label: _styles.label }
                            } elevation={4} variant={"outlined"} label="Connect with Metamask" />
                    }
                </RX.View>
            </RX.View>
        );
    }




    private _onPressLogo = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        NavContextStore.navigateToTodoList('', false);
    };

}
