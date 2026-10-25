import {useEffect} from 'react'
import {business} from '../config/business'
export const useTitle = (t: string) => { useEffect(() => { document.title = `${t} | ${business.name}` }, [t]) }
