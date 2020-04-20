// import CBSAccount from './CBSAccount';
// import CBSNewsAccount from './CBSNewsAccount';
// import TwoFourSevenSportsAccount from './TwoFourSevenSportsAccount';
import {ACCOUNTS} from './accounts';
//import Account from './Account';

class AccountFactory{
  
    getAccount(name){
        if(typeof(name) !== 'string' || name === null) return {};
        for(let acc of ACCOUNTS){
            if(acc.facebookPageUniqueLookup === name) return {...acc}
        }
        return {}
    }
}
export default AccountFactory;