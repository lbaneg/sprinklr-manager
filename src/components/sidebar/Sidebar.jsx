import React from 'react';
import './Sidebar.css';
import {IoIosCloudUpload,IoIosHome,IoMdCash,IoIosBody} from 'react-icons/io';

function Sidebar (props){
      const tabs =[<IoIosHome/>,<IoIosCloudUpload/>,<IoMdCash/>,<IoIosBody/>];
      //const tabs =[{to:'/',icon:<IoIosHome/>},{to:'/upload',icon:<IoIosCloudUpload/>},{to:'/bids',icon:<IoMdCash/>},{to:'/age',icon:<IoIosBody/>}];
      return (
        <section id="sidebar">
          <div className="sidebar-content">
          
            <ul>
              {
                tabs.map((tab,i)=>{
                  let tabClass = 'tab-not-active';
                  if(props.activeTab === i){
                    tabClass = 'tab-active';
                  }
                  return <li key={ i }> <div id={ i } onClick={props.onTabClick} className={tabClass}> {tab}</div> </li>
                })
              }
          
            </ul>
          </div>
        
        </section>
      );
    
  }
  
  export default Sidebar;