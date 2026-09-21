'use client';
import { useEffect } from 'react';
import ApproachPage from '../../approach/page';
import { useLanguage } from '../../../context/LanguageContext';
export default function ArabicApproachPage(){const {setLanguage}=useLanguage();useEffect(()=>setLanguage('ar'),[setLanguage]);return <ApproachPage/>}
