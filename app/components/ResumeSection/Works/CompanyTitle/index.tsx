import Ping from '@components/Ping';

export default function CompanyTitle({ title }: { title: string }) {
  return (
    <div className="w-max py-8">
      <div className="flex items-center">
        <Ping />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="py-1 sticky">
        <p className="p-0">Frontend Developer / Intern</p>
        <p className="p-0">개발팀</p>
      </div>
    </div>
  );
}
