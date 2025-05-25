export function CryptoSkeleton() {
  return (
    <div className='w-full'>
      {/* Mobile skeleton */}
      <div className='block md:hidden space-y-4'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='bg-card border border-border rounded-lg p-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
                <div className='space-y-1'>
                  <div className='h-4 w-20 bg-muted rounded animate-pulse' />
                  <div className='h-3 w-12 bg-muted rounded animate-pulse' />
                </div>
              </div>
              <div className='text-right space-y-1'>
                <div className='h-4 w-16 bg-muted rounded animate-pulse' />
                <div className='h-3 w-12 bg-muted rounded animate-pulse' />
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='h-3 w-16 bg-muted rounded animate-pulse' />
              <div className='h-3 w-20 bg-muted rounded animate-pulse' />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className='hidden md:block'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-border'>
                <th className='text-left py-3 px-4'>
                  <div className='h-4 w-12 bg-muted rounded animate-pulse' />
                </th>
                <th className='text-left py-3 px-4'>
                  <div className='h-4 w-16 bg-muted rounded animate-pulse' />
                </th>
                <th className='text-right py-3 px-4'>
                  <div className='h-4 w-12 bg-muted rounded animate-pulse ml-auto' />
                </th>
                <th className='text-right py-3 px-4'>
                  <div className='h-4 w-16 bg-muted rounded animate-pulse ml-auto' />
                </th>
                <th className='text-right py-3 px-4'>
                  <div className='h-4 w-20 bg-muted rounded animate-pulse ml-auto' />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className='border-b border-border'>
                  <td className='py-4 px-4'>
                    <div className='h-4 w-8 bg-muted rounded animate-pulse' />
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
                      <div className='space-y-1'>
                        <div className='h-4 w-24 bg-muted rounded animate-pulse' />
                        <div className='h-3 w-16 bg-muted rounded animate-pulse' />
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-20 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-16 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 w-24 bg-muted rounded animate-pulse ml-auto' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
