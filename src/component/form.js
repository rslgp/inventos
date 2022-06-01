import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Stack,styled,Paper } from '@mui/material';

import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

function adicionar(type, dataJSON){
    //{"name":"politica", "votos":5, "tags":[], "link":"google.com","contato":"", "page":"Teste"}
    dataJSON["page"] = type;
    dataJSON["votos"]=0;
    dataJSON["Avaliacao"]={"Avaliacao":{"1":0,"2":0,"3":1,"4":0,"5":0}};
    dataJSON["tags"]=[];

    (async function main(type, dataJSON) {
        try{
            await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
            });
        
            await doc.loadInfo(); 
        
            const sheet = doc.sheetsByIndex[0];
            let novo = {};
            novo.Dados = JSON.stringify(dataJSON);
            console.log(novo);
            // if(type==="categorias"){
            //     //adiciona em categorias e cria uma nova categoria
            //     novo[dataJSON.page] = JSON.stringify(dataJSON);
            //     console.log(novo);
            //     let instance = await sheet.getRows({limit:1});
            //     console.log(instance);
            //     let headers = instance[0]._sheet.headerValues;
            //     headers.push(dataJSON.page);
            //     await sheet.setHeaderRow(headers);
            // }
            await sheet.addRow(novo);
        }catch(e){
            console.log("form");
            console.log(e); 
        }
        
        })(type, dataJSON);
}

function switchFormType(actualPage, handleTextField){
    let content;
    switch(actualPage){
        case "categorias":
            //adicionar uma categoria
            content= <>
            <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleTextField}
            id="name"
            label="Nome"
          />
            </>
            break;
        default:
            //any categories
            content = <>
            <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleTextField}
            id="name"
            label="Nome"
          />
          <TextField
            autoFocus
            margin="dense"
            type="url"
            fullWidth
            variant="standard"
            onChange={handleTextField}
            id="link"
            label="link"
          />
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleTextField}
            id="contato"
            label="Contato"
          />
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleTextField}
            id="tags"
            label="Tags entre virgulas"
          />
            </>
            break;
    }
    return content;
}

export default function FormDialog( props ) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({});

  const handleTextField = (e) => {
    formData[e.target.id]= e.target.value;
    setFormData(formData)

    if(e.target.id === "tags"){            
        formData["tags"]= e.target.value.split(",");
        setFormData(formData)
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirm = () => {
    handleClose(); 
    adicionar(props.actualPage, formData);
    console.log(props.categoriasInstance);
    let newCards = props.categoriasInstance.state.cards;
    newCards.push(formData);
    props.categoriasInstance.setState({cards: newCards})
  }

  return (
    <div>
    <Stack>
        {/* https://mui.com/material-ui/react-stack/ */}
        
    <Item>
        <Button variant="outlined" onClick={handleClickOpen}>
            + Adicionar
        </Button>
        <Dialog open={open} onClose={handleClose} 
                onKeyUp={(e) => {
                    const ENTER = 13;
                    if (e.keyCode === ENTER) {
                    confirm();
                    }
                }}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
            {
                switchFormType(props.actualPage, handleTextField)
            }
            
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={confirm}>Adicionar</Button>
            </DialogActions>
        </Dialog>
    
    </Item>

    <Item>
        <Button variant="outlined" onClick={()=>{window.history.back()}}>
            Voltar
        </Button>
    </Item>
    <Item>
        <Link to="/categorias/todos" target="_self" rel="noopener noreferrer">Todos</Link>
        
    </Item>
    </Stack>
    </div>
  );
}
