'use client';
import { useEffect } from 'react';
import ApproachPage from '../../approach/page';
import { useLanguage } from '../../../context/LanguageContext';
export default function EnglishApproachPage(){const {setLanguage}=useLanguage();useEffect(()=>setLanguage('en'),[setLanguage]);return <ApproachPage/>}
