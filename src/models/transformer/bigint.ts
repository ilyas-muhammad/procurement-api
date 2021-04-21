interface BigIntTransformer {
  from: (value: string) => bigint;
  to: (value: bigint) => bigint;
}

const bigintTransformer: BigIntTransformer = {
  from: (value: string): bigint => BigInt(value),
  to: (value: bigint): bigint => value,
};

export default bigintTransformer;
