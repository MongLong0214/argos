'use client';
import React from 'react';
import {useForm, Controller, Control} from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'


// 폼 필드 인터페이스 정의
interface IFormInput {
    Search: string;
    Country: string;
    Period: string;
    Channel: string;
}

// SelectWrapperProps 인터페이스 정의
interface ISelectWrapperProps {
    title: string;
    options: string[];
    control: Control<IFormInput>;
}

function getSearchResults(search: string, country: string, period: string): string[] {
    search = search.toLowerCase();
    if (search === '캐시미어' && (country === 'Republic of Korea' || country === 'United States')) {
        switch (period) {
            case 'Week':
                return ['아크네 머플러', '캐시미어 머플러', '아크네 머플러', '아크네 스튜디오 머플러', '목도리', '스카프', '아크네 스튜디오', '버버리 머플러'];
            case 'Month':
                return ['캐시미어 코트', '-', '캐시미어 니트', '-', '캐시미어 머플러', '-', '-', '-'];
            case 'Year':
                return ['캐시미어 코트', '고비 캐시미어', '캐시미어 니트', '고비 캐시미어', '캐시미어 머플러', '캐시미어 세탁', '캐시미어 100', '유니클로 캐시미어'];
        }
    } else if (search === 'silk scarf' || search === '실크 스카프') {
        switch (period) {
            case 'Week':
                return ['silk hair scarf', 'hermes', 'silk head scarf', 'hermes silk', 'head scarf', 'hermes scarf', 'black silk scarf', 'silk scarf'];
            case 'Month':
                return ['silk head scarf', 'louis vuitton', 'silk scarf for hair', 'how to tie a silk scarf', 'hermes silk scarf', 'silk scarf pokemon', 'gucci scarf', 'louis vuitton scarf silk'];
            case 'Year':
                return ['hair scarf', 'hermes scarf', 'head scarf', 'black silk scarf', 'silk head scarf', 'silk scarves', 'hermes', 'white silk scarf'];
        }
    } else if ((search === '머플러' || search === '목도리')&& country === 'Republic of Korea') {
        switch (period) {
            case 'Week':
                return ['아크네 머플러', '캐시미어 머플러', '아크네', '아크네 스튜디오 머플러', '목도리', '스카프', '아크네 스튜디오', '버버리 머플러'];
            case 'Month':
                return ['아크네 머플러', '-', '버버리 머플러', '-', '머플러 매는 법', '-', '아크네 스튜디오 머플러', '-'];
            case 'Year':
                return ['아크네', '아크네 스튜디오', '아크네 머플러', '캐시미어 머플러', '목도리', '아크네 스튜디오 머플러', '머플러 매는 법', '스카프'];
        }
    }

    // 기본값이나 다른 경우에 대한 결과를 반환합니다.
    return ['12월 달력', '12월 날씨', '11월 12일', '12월 축제', '11월 11일 날씨', '12월 개봉 영화', '12월 25일', '크리스마스'];
}



// SelectWrapper 컴포넌트를 수정합니다.
const SelectWrapper = ({ title, options, control }: ISelectWrapperProps) => {
    return (
        <div className="flex flex-col w-[200px]">
            <div className="mb-2 text-sm font-medium text-gray-400">{title}</div>
            <Controller
                name={title as keyof IFormInput}
                control={control}
                render={({ field: { ref, ...restField } }) => ( // ref를 제거하고 restField를 전달합니다.
                    <Select {...restField} onValueChange={restField.onChange} value={restField.value}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={title} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
};

export default function Home() {
    const router = useRouter();
    const { control, handleSubmit } = useForm<IFormInput>({
        defaultValues: {
            Search: '',
            Country: '',
            Period: '',
            Channel: ''
        }
    });

    const onSubmit = (data: IFormInput) => {
        const results = getSearchResults(data.Search, data.Country, data.Period);

        console.log(data);
        console.log(results);

        // 쿼리 파라미터로 변환합니다 (예: JSON 문자열화).
        const queryParams = encodeURIComponent(JSON.stringify(results));

        // 결과 페이지로 리다이렉트하면서 쿼리 파라미터를 포함시킵니다.
        router.push(`/results?data=${queryParams}`);
    };

    // 각 Select 컴포넌트의 옵션들
    const countries = ["Republic of Korea", "Japan", "China", "United States", "German", "Singapore", "United Kingdom", "France"];
    const periods = ["Week", "Month", "Year"];
    const channels = ["Google"];

    return (
        <main className="flex w-full min-h-screen items-center justify-center p-24 bg-gray-900">
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-end justify-center gap-4 w-full">
                {/* Input 필드 */}
                <div className="flex flex-col w-[200px]">
                    <div className="mb-2 text-sm font-medium text-gray-400">Search</div>
                    <Controller
                        name="Search"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} className="w-full" id="searchInput" placeholder="Search" type="text" />
                        )}
                    />
                </div>
                {/* Select 필드들 */}
                <SelectWrapper title="Country" options={countries} control={control} />
                <SelectWrapper title="Period" options={periods} control={control} />
                <SelectWrapper title="Channel" options={channels} control={control} />
                {/* Submit 버튼 */}
                <div className="flex flex-col h-10 w-[150px]">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md shadow" type="submit">
                        Search
                    </Button>
                </div>
            </form>
        </main>
    );
}