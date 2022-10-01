package org.jivesoftware.util;

import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PluginVersionComparatorTest
{
    @Test
    public void testString() throws Exception
    {
        // Setup test fixture.
        final String o1 = "bb";
        final String o2 = "aa";
        final List<String> collection = Arrays.asList(o1, o2);

        // Execute system under test.
        collection.sort(new PluginVersionComparator());

        // Verify results.
        assertEquals(o2, collection.get(0));
        assertEquals(o1, collection.get(1));
    }

    @Test
    public void testXYZ() throws Exception
    {
        // Setup test fixture.
        final String o1 = "0.2.2";
        final String o2 = "0.1.4";
        final List<String> collection = Arrays.asList(o1, o2);

        // Execute system under test.
        collection.sort(new PluginVersionComparator());

        // Verify results.
        assertEquals(o2, collection.get(0));
        assertEquals(o1, collection.get(1));
    }

    @Test
    public void testMultiDigitXYZ() throws Exception
    {
        // Setup test fixture.
        final String o1 = "10.2.2";
        final String o2 = "1.1.4";
        final List<String> collection = Arrays.asList(o1, o2);

        // Execute system under test.
        collection.sort(new PluginVersionComparator());

        // Verify results.
        assertEquals(o2, collection.get(0));
        assertEquals(o1, collection.get(1));
    }
}
