'use client';
import { useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import ServiceDetail from '../../../../components/ServiceDetail';
export default function Page(){const {setLanguage}=useLanguage();useEffect(()=>setLanguage('en'),[setLanguage]);return <ServiceDetail type="creative"/>}
