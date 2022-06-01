import React from 'react';
import { useParams } from "react-router-dom";

//components
import Page from '../page';

export default function PageId(){
    
  let params = useParams();
  return <Page page={params.pageId}/>;
} 
