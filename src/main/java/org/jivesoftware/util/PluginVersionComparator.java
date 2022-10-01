/**
 * Copyright (C) 2022 Ignite Realtime Foundation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jivesoftware.util;

import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.Collectors;

/**
 * A Comparator that is intended to be used for version identifiers that do not necessarily 'neatly' fit in the
 * x.y.z syntax. This should be used as a last resort, as with the unpredictability of the value format that this
 * comparator uses, the outcome is equally unpredictable.
 *
 * This comparator splits each value that is to be compared in segments which are separated by a full stop character,
 * using a left-zero pad to 25 characters, then reconstructing the value again by merging each section with full stop
 * characters. The resulting value is alphabetically compared.
 *
 * The intention here is to have a poor-mans solution that allows x.y.z formatted strings that use multiple digets per
 * segment to be correctly sorted, when alphabetic sorting is used.
 * Examples:
 * <pre>
 * 1.8.4  -> 0000000000000000000000001.0000000000000000000000008.0000000000000000000000004
 * 1.14.4 -> 0000000000000000000000001.0000000000000000000000014.0000000000000000000000004
 * foobar -> 0000000000000000000foobar
 * </pre>
 *
 * This implementation does not allow null values.
 */
public class PluginVersionComparator implements Comparator<String>
{
    static final int ZERO_PAD_LENGTH = 25;

    @Override
    public int compare(final String o1, final String o2)
    {
        return zeropad(o1).compareTo(zeropad(o2));
    }

    static String zeropad(final String value) {
        return Arrays.stream(value.split("\\."))
            .map(segment -> StringUtils.zeroPadString(segment, ZERO_PAD_LENGTH))
            .collect(Collectors.joining("."));
    }
}
