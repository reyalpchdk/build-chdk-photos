/*
 * Copyright (C) 2023 <reyalp (at) gmail dot com>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  with this software. If not, see <http://www.gnu.org/licenses/>.
 */
import {
  SelId,
  SelSetter
} from '@/interfaces/buildctlprops';

type BuildOpt = {
    id:string;
    label?:string;
}
type BuildOptCtlProps = {
  title:string;
  opts: BuildOpt[];
  sel: SelId;
  setSel: SelSetter;
}
export default function BuildOptCtl({ title, opts, sel, setSel }: BuildOptCtlProps ) {
  const sel_opt = opts.find( (opt) => opt.id == sel )
  return (
    <div className="min-w-[19em]">
      <h3 className="font-bold text-l my-1">{title}</h3>
      {sel_opt && opts.length > 1  && (
        <button
          onClick={() => setSel(null)}
          className="text-left block p-1 w-full bg-sky-400 relative group">
         {sel_opt.label || sel_opt.id}
         <span className="absolute right-0 top-0 text-2xl right-2 group-hover:scale-110 font-bold text-red-500 leading-none">&#10226;</span>
        </button>
      )}
      {sel_opt && opts.length == 1  && (
        <div
          className="text-left block p-1 w-full bg-slate-300 relative">
         {sel_opt.label || sel_opt.id}
        </div>
      )}
      {!sel_opt && (
        <div className="max-h-[50vh] overflow-y-auto">
          {opts.map((opt: BuildOpt) => (
            <button
              onClick={() => setSel(opt.id)}
              key={opt.id}
              className={"text-left block p-1 w-full even:bg-slate-50 odd:bg-sky-100 hover:bg-sky-300"}>
             {opt.label || opt.id}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
