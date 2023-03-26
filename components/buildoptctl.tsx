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
  sel:SelId
  setSel: SelSetter;
}
export default function BuildOptCtl({ title, opts, sel, setSel }: BuildOptCtlProps ) {
  const sel_opt = opts.find( (opt) => opt.id == sel )
  return (
    <div className="min-w-[19em]">
      <h3 className="font-bold text-l my-1">{title}</h3>
      {sel_opt && (
        <button
          onClick={() => setSel(null)}
          key={sel_opt.id}
          className="text-left block p-1 w-full bg-sky-400 relative">
         {sel_opt.label || sel_opt.id}
         <span className="absolute right-1">&#10060;</span>
        </button>
      )}
      {!sel_opt &&(
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