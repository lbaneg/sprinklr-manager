// import CBSAccount from './CBSAccount';
// import CBSNewsAccount from './CBSNewsAccount';
// import TwoFourSevenSportsAccount from './TwoFourSevenSportsAccount';
import {ACCOUNTS} from './accounts';
import Account from './Account';

class AccountFactory{
    constructor(){
        this.map = new Map(ACCOUNTS);
    }
    getAccount(name){
        if(typeof(name) !== 'string' || name === null) return {};
        const props = this.map.get(name);
        return props? new Account(...props):{};
        // switch(name){
        //     case 'CBS':
        //         account = new CBSAccount(props);
        //         break;
        //     case 'CBSNews':
        //         account = new CBSNewsAccount(props);
        //         break;
        //     case '247Sports':
        //         account = new TwoFourSevenSportsAccount(props);
        //         break;
        //     default:
        //         account = {};
        // }
        //return account;
    }
}
export default AccountFactory;