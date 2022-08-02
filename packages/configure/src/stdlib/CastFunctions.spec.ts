import { NumberCast, BooleanCast, StringCast, DateCast } from './CastFunctions'

describe('Cast Function tests ->', () => {
  const makeCastAssert = (castFn:any) => {
    const assertFn = (raw:any, output:any): void => {
      expect(castFn(raw)).toBe(output);
    }
    return assertFn
  };
  const makeCastAssertException = (castFn:any) => {
    const assertFn = (raw:any, error:string): void => {
      expect(() => {
	castFn(raw);
      }).toThrow(error)
    };
    return assertFn
  };

  test('NumberCast handles most reasonable cases',  () => {
    const assertNC = makeCastAssert(NumberCast);
    const assertThrow = makeCastAssertException(NumberCast);

    assertNC(undefined, null);
    assertNC(null, null);
    assertNC('', null);

    assertNC(5, 5);
    assertNC(500_000, 500000);

    assertNC('5', 5);
    assertNC('500,000', 500000);



    //throwing an error on 'four' allows the user to realize an error and rewrite 'four' to 4
    // even though 'four' could be interpreted as a number, we have chosen not to
    assertThrow('four', "'four' parsed to 'NaN' which is non-finite")
    
    /*
    NaNs are a complex topic, the basic reason we don't include them
    is that they don't work well future computations or comparisons.
    https://en.wikipedia.org/wiki/NaN
    
    NaN !== NaN
    (NaN > Nan) === false
    (NaN < Nan) === false
    */
    assertThrow('asdf', "'asdf' parsed to 'NaN' which is non-finite")
    assertThrow('nan', "'nan' parsed to 'NaN' which is non-finite")
    assertThrow(NaN, "'NaN' parsed to 'NaN' which is non-finite")

    // Similarly Infinity rarely comes up, and isn't Computable  
    assertThrow(1/0, "'Infinity' parsed to 'Infinity' which is non-finite")
    assertThrow(-1/0, "'-Infinity' parsed to '-Infinity' which is non-finite")

    // add tests for scientific notation and other number formats
  })

  test('StringCast handles most reasonable cases',  () => {
    const assertSC = makeCastAssert(StringCast);
    assertSC(undefined, null);
    assertSC(null, null);
    assertSC('', null);

    assertSC('foo', 'foo');
  })

  test('BooleanCast handles most reasonable cases',  () => {
    const assertBC = makeCastAssert(BooleanCast);
    const assertThrow = makeCastAssertException(BooleanCast)
    assertBC(undefined, null);
    assertBC(null, null);
    assertBC('', null);

    assertBC(true, true);
    assertBC(false, false);

    assertBC('true', true);
    assertBC('TRUE', true);
    assertBC('True', true);
    assertBC('trUe', true);
    assertBC('yes', true);
    assertBC('1', true);
    assertBC('affirmative', true);
    
    assertBC('false', false);
    assertBC('fAlse', false);
    assertBC('no', false);
    assertBC('negative', false);
    assertBC('0', false);
    assertBC('-1', false);

    assertThrow('foobar', "'foobar' can't be converted to boolean")
  })

  test('DateCast handles most reasonable cases',  () => {
    // eventually I want this 2500 test file from pandas to be our goal for DWIM date parsing
    // https://github.com/pandas-dev/pandas/blob/main/pandas/tests/tools/test_to_datetime.py
    const assertDC = (raw:any, output:any): void => {
      expect(DateCast(raw)).toStrictEqual(output);
    }
    const assertThrow = makeCastAssertException(DateCast)
    assertDC(undefined, null);
    assertDC(null, null);
    assertDC('', null);

    const dString = "2022-07-30";
    const d = new Date(dString);
    assertDC(dString, d)

    assertThrow('foo', "'foo' parsed to 'Invalid Date' which is invalid")
    assertThrow(1/0, "Infinity parsed to 'Invalid Date' which is invalid")
    assertThrow('2022-07-35', "'2022-07-35' parsed to 'Invalid Date' which is invalid")
  })


/*
How do you plan to handle ambiguous dates where it's not clear from the numbers the position of Day and Month values e.g. 2022-04-06? I get this question from prospects and don't have a clear answer since we rely on date-fns and I'm not sure the exact behavior.


That's a good question.  for this release I think we're best off sticking with ISO Date parsing.
in an upcoming release we will start adding cast options
as `cast:{args for cast function}` or `castArgs:{args for cast function}`

The longterm goal is to make this part of mapping.  Looking at a single date, you can't tell the order of month vs day, looking at a whole column, you can, the position that has values over 12 is the day column, that dictates your cast function.  This doesn't even require reading a model built off of all of our imports, it could be inferred from most single imports.  I'm sure @stephen has thoughts about this.  The cast function should have access to metatdata about the import, informed by mapping.
*/
})
  

