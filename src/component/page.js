import React, { Component } from 'react';

//components
import Categorias from './categorias';
import varGLOBAL from './variaveisAmbiente'

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);


class Page extends Component {

    constructor(props) {
        super(props);
        this.state = {
          content: [], 
          page: props.page || undefined,
          filterTags: props.tags || undefined
        };  
      }

      
    //ATUALIZAR PROPS VINDAS DO PAI
    static getDerivedStateFromProps(nextProps, state) {
        if(state){
            if (nextProps.page !== state.page){ 
            state.page=nextProps.page;
            }
        }
        return state;
    }
    
    componentDidMount() {   
        (async function main(self) {
            try{
                await doc.useServiceAccountAuth({
                client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
                });
            
                await doc.loadInfo(); 
            
                const sheet = doc.sheetsByIndex[0];
                let rows = await sheet.getRows();

                let temp=[], t={};
                rows.forEach( (x)=> {
                    t = JSON.parse(x.Dados);
                    console.log(t +" "+self.props.page);
                    //limita resultado a uma pagina especifica
                    if(self.props.page && (t.page === self.props.page || self.props.page==="todos") ) temp.push( t );
                });
                varGLOBAL.cards = temp;
                self.setState({ content: varGLOBAL.cards });
            }catch(e){
                console.log("page");
                console.log(e); 
            }
            
            })(this);        

    }

    render(){
        return (
            <Categorias cards={this.state.content} actualPage={this.state.page} />
        )

    }

}

export default Page; 