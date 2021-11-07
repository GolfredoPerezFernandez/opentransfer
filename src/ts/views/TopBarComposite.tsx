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
        height: 50,
        borderBottomWidth: 1,
        borderColor: Colors.gray66,
        flexDirection: 'row',
        paddingHorizontal: 16,
    }),
    logoContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
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
        color: Colors.menuText,
        marginTop: 20,
    })
};

import { UserMoralis } from '../models/IdentityModels';
interface TopBarCompositeState {
    isLogin: boolean;
    isMetamask: boolean;
    user: UserMoralis;
}

export interface TopBarCompositeProps extends RX.CommonProps {
    showBackButton: boolean;
    onBack?: () => void;
}


const Moralis = require('moralis');
const serverUrl = "https://kyyslozorkna.usemoralis.com:2053/serve";
const appId = "eKUfnm9MJRGaWSNh8mjnFpFz5FrPYYGB7xS4J7nC";

Moralis.start({ serverUrl, appId });
export default class TopBarComposite extends ComponentBase<TopBarCompositeProps, TopBarCompositeState> {


    protected _buildState(props: TopBarCompositeProps, initState: boolean): Partial<TopBarCompositeState> | undefined {
        const partialState: Partial<TopBarCompositeState> = {
            isLogin: CurrentUserStore.getLogin(),
            user: CurrentUserStore.getUser(),
            isMetamask: CurrentUserStore.getMetamask(),
        };
        return partialState;
    }
    render(): JSX.Element | null {

        return (
            <RX.View style={_styles.background}>

                <RX.View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <RX.Button onPress={this._onPressLogo}>
                        <RX.View style={_styles.logoContainer}>
                            <RX.Image source={ImageSource.todoLogo} style={_styles.logoImage} />
                            <RX.Text style={_styles.logoText}>
                                {'OpenSeaTransfers'}
                            </RX.Text>
                        </RX.View>
                    </RX.Button>


                </RX.View>
            </RX.View>
        );
    }




    private _onPressLogo = (e: RX.Types.SyntheticEvent) => {
        e.stopPropagation();

        NavContextStore.navigateToTodoList('', false);
    };

}
