import { Label } from '~/components/ui/label';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

export enum ChartColor {
  red = '#ef4444',
  blue = '#3b82f6',
  green = '#14b8a6',
}

export type DataChartProps = {
  name: string;
  description: string;
  color: ChartColor;
  altColor?: ChartColor;
  type?: string;
  data: {
    name: string;
    value: number;
  }[];
};

type CustomTooltipProps = {
  label: string;
  payload: {
    value: number;
  }[];
};

const CustomTooltip = ({ label, payload }: CustomTooltipProps) => {
  if (label && payload && payload.length) {
    return (
      <div className='custom-tooltip bg-background'>
        <p className='label'>{`${label}`}</p>
        <p className='desc'>{`$${payload[0].value}`}</p>
      </div>
    );
  } else {
    return null;
  }
};

export function DataChart({
  name,
  description,
  data,
  color,
  altColor,
  type,
}: DataChartProps) {
  return (
    <div className='rounded-lg border bg-background text-card-foreground shadow-sm w-full'>
      <div className='flex flex-col space-y-1.5 p-6'>
        <h3 className='text-2xl font-semibold leading-none tracking-tight'>
          {name}
        </h3>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      {type === 'bar' ? (
        <>
          <ResponsiveContainer width='100%' height={500}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray='3 3' /> */}
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip
                content={<CustomTooltip label={''} payload={[]} />}
                cursor={{ fill: 'transparent' }}
              />
              {/* <Legend /> */}
              <Bar dataKey='value' stackId='a' fill={color} />
              <Bar dataKey='eValue' stackId='a' fill={altColor} />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <ResponsiveContainer width='100%' height={500}>
          <LineChart data={data}>
            <XAxis
              dataKey='name'
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#71717a'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip label={''} payload={[]} />} />
            <Line
              type='monotone'
              dataKey='value'
              stroke={color}
              strokeWidth={3}
              connectNulls
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
